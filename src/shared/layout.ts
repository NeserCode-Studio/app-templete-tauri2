export type SettingInputItemType = "text" | "email" | "password" | "number";

export interface SettingItemGroup {
  title: string;
  description?: string;
}

export interface SettingItemProps {
  label?: string;
  title?: string;
  description?: string;
}

export interface SettingInputItemProps extends SettingItemProps {
  type: SettingInputItemType;
  value: string;
  placeholder?: string;
  submit?: string;

  onItemChange?: (value: string) => void;
  onItemSubmit?: (data: FormData) => void;
}

export type SettingSelectItemItem = {
  value: string;
  label: string;
};
export interface SettingSelectItemProps extends SettingItemProps {
  items: SettingSelectItemItem[];
  value?: SettingSelectItemItem;
  placeholder?: string;
  submit?: string;

  onItemChange?: (value: string) => void;
  onItemSubmit?: (data: FormData) => void;
}

export interface SettingOptionalItemProps extends SettingItemProps {
  label: string;
  id: string;

  value?: boolean;
  onItemChange: (value: boolean) => void;
}
