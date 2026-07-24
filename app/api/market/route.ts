import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';

const initialMarketPrices = [
  {
    name: 'Wheat (Kanak)',
    category: 'Grains',
    currentPrice: 2850,
    previousPrice: 2750,
    location: 'Shimla Mandi',
    supplier: 'Pahadi Grain Co-op',
    rating: 4.8,
  },
  {
    name: 'Basmati Rice',
    category: 'Grains',
    currentPrice: 4200,
    previousPrice: 4100,
    location: 'Dehradun APMC',
    supplier: 'Doon Agro Suppliers',
    rating: 4.7,
  },
  {
    name: 'Hill Apple (Royal Delicious)',
    category: 'Fruits',
    currentPrice: 8500,
    previousPrice: 8200,
    location: 'Kotkhai Fruit Mandi',
    supplier: 'Kinnaur Orchards',
    rating: 4.9,
  },
  {
    name: 'Potato (Kufri Jyoti)',
    category: 'Vegetables',
    currentPrice: 1850,
    previousPrice: 1920,
    location: 'Solan APMC',
    supplier: 'Solan Farmers Producer Co.',
    rating: 4.4,
  },
  {
    name: 'Tomato (Himsoni)',
    category: 'Vegetables',
    currentPrice: 3400,
    previousPrice: 3800,
    location: 'Mandi APMC',
    supplier: 'Valley Fresh Produce',
    rating: 4.5,
  },
  {
    name: 'Organic Honey',
    category: 'Dairy & Natural',
    currentPrice: 650,
    previousPrice: 600,
    location: 'Kullu Organic Hub',
    supplier: 'Himalayan Bee Farms',
    rating: 5.0,
  }
];

export async function GET(req: NextRequest) {
  try {
    let items = await prisma.marketPrice.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    if (items.length === 0) {
      await prisma.marketPrice.createMany({
        data: initialMarketPrices,
      });
      items = await prisma.marketPrice.findMany({
        orderBy: { updatedAt: 'desc' },
      });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'All';

    let filtered = items;
    if (search) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(search) || 
        i.location.toLowerCase().includes(search)
      );
    }
    if (category !== 'All') {
      filtered = filtered.filter(i => i.category === category);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Failed to fetch market prices:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
