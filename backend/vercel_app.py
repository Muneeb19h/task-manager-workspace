import os
import sys

# This tells Python where to look for our backend files
sys.path.append(os.path.dirname(__file__))

# Point directly to the wsgi application inside your config folder
from config.wsgi import application
app = application