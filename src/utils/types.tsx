
interface CustomButtonProps {
    title: string;
    loading?: boolean;
    onPress?: () => void
    disabled?: boolean
}

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void
}

interface CustomTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';
    style?: any;
    fontSize?: number;
    children: React.ReactNode;
    fontFamily?: 'SemiBold' | 'Regular' | 'Bold' | 'Medium' | 'Light';
    numberOfLines?: number;
}

export type lat1 = number
export type lon1 = number
export type lat2 = number
export type lon2 = number

export interface calculateDistance {
    lat1: lat1
    lat2: lat2
    lon1: lon1
    lon2: lon2
}

export interface Version {
    message: string;
    version: VersionClass;
}

export interface VersionClass {
    _id:       string;
    version:   string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface Banners {
    __v:         number;
    _id:         string;
    createdAt:   Date;
    description: string;
    imageUrl:    string;
    link:        string;
    targetCity:  string[];
    title:       string;
    updatedAt:   Date;
}
