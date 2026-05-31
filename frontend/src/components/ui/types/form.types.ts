export interface FormOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface FormSelectProps {
  labelTitle: string;
  darkMode: boolean;
  selectedValue: string;
  options: FormOption[];
  onSelectChange: (value: string) => void;
}
