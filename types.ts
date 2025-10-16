export interface NavLink {
  name: string;
  href: string;
}

export interface ProjectionYearData {
  revenue: number; // Value in millions USD
  customers: number;
  orders: number;
  margin: number; // Percentage value
  virtualShelves: number;
  partners: number;
}

export interface ProjectionData {
  [key: string]: ProjectionYearData;
}

export interface RevenueStream {
  value: string | number;
  title: string;
  description: string;
}
