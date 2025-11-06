export const dashboardData = {
  todaySales: 300,
  todayOrders: 37,
  openOrders: 10,
  inventoryAlerts: 4,
  
  recentOrders: [
    {
      id: '1018',
      customer: 'Kaiell Banac',
      time: '15 minutes ago',
      total: 175,
      status: 'pending',
    },
    {
      id: '1017',
      customer: 'Robert Kim',
      time: '38 minutes ago',
      total: 125,
      status: 'completed',
    },
    {
      id: '1016',
      customer: 'Melissa Thompson',
      time: '1 hour ago',
      total: 150,
      status: 'completed',
    },
    {
      id: '1015',
      customer: 'Daniel Garcia',
      time: '1.5 hours ago',
      total: 175,
      status: 'cancelled',
    },
    {
      id: '1014',
      customer: 'Sarah Wilson',
      time: '2 hours ago',
      total: 625,
      status: 'completed',
    },
  ],
  
  popularItems: [
    {
      name: 'Cappuccino',
      count: 15,
      price: 450,
    },
    {
      name: 'Latte',
      count: 12,
      price: 475,
    },
    {
      name: 'Croissant',
      count: 10,
      price: 325,
    },
    {
      name: 'Cold Brew',
      count: 8,
      price: 500,
    },
  ],
};