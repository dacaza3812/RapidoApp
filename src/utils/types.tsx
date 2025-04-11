
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

export interface Direction {
    routes:    Route[];
    waypoints: Waypoint[];
    code:      string;
    uuid:      string;
}

export interface Route {
    weight_name: string;
    weight:      number;
    duration:    number;
    distance:    number;
    legs:        Leg[];
    geometry:    Geometry;
}

export interface Geometry {
    coordinates: Array<number[]>;
    type:        string;
}

export interface Leg {
    via_waypoints: any[];
    annotation:    Annotation;
    admins:        Admin[];
    weight:        number;
    duration:      number;
    steps:         any[];
    distance:      number;
    summary:       string;
}

export interface Admin {
    iso_3166_1_alpha3: string;
    iso_3166_1:        string;
}

export interface Annotation {
    distance: number[];
    duration: number[];
}

export interface Waypoint {
    distance: number;
    name:     string;
    location: number[];
}



export interface MapBox {
    routes:    Route[];
    waypoints: Waypoint[];
    code:      string;
    uuid:      string;
}

export interface Route {
    weight_name: string;
    weight:      number;
    duration:    number;
    distance:    number;
    legs:        Leg[];
    geometry:    Geometry;
}

export interface Geometry {
    coordinates: Array<number[]>;
    type:        string;
}

export interface Leg {
    via_waypoints: any[];
    annotation:    Annotation;
    admins:        Admin[];
    weight:        number;
    duration:      number;
    steps:         any[];
    distance:      number;
    summary:       string;
}

export interface Admin {
    iso_3166_1_alpha3: string;
    iso_3166_1:        string;
}

export interface Annotation {
    speed:    number[];
    distance: number[];
    duration: number[];
}

export interface Waypoint {
    distance: number;
    name:     string;
    location: number[];
}
