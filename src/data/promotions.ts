import { Promotion } from '../types';

export const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Giảm 50% vé xem phim cuối tuần',
    description: 'Áp dụng cho tất cả suất chiếu từ thứ 6 đến chủ nhật',
    discount: 50,
    validUntil: '2025-02-28',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
    code: 'WEEKEND50'
  },
  {
    id: '2',
    title: 'Mua 2 tặng 1 - Combo bắp nước',
    description: 'Mua 2 combo bắp nước size L, tặng 1 combo size M',
    discount: 33,
    validUntil: '2025-01-31',
    image: 'https://images.pexels.com/photos/274131/pexels-photo-274131.jpeg?auto=compress&cs=tinysrgb&w=600',
    code: 'COMBO321'
  },
  {
    id: '3',
    title: 'Sinh viên giảm 30%',
    description: 'Xuất trình thẻ sinh viên để được giảm giá',
    discount: 30,
    validUntil: '2025-12-31',
    image: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=600',
    code: 'STUDENT30'
  }
];