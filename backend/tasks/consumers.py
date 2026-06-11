import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        # Accept connection only if the user is logged in/authenticated
        if self.user.is_authenticated:
            # Create a private group name using the user's ID (e.g., "user_notification_9")
            self.group_name = f"user_notification_{self.user.id}"
            
            # Join the private user notification group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            # Reject connection if unauthorized
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            # Leave the notification group cleanly
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    # This method receives messages sent from Django views and pushes them to the frontend browser
    async def send_notification(self, event):
        message = event["message"]
        notification_type = event["notification_type"]
        task_title = event["task_title"]

        # Send the clean JSON payload down the WebSocket line to the frontend client
        await self.send(text_data=json.dumps({
            "type": notification_type,
            "message": message,
            "task_title": task_title
        }))