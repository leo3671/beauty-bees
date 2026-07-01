import Link from 'next/link';

const categories = [
  { name: 'Cleanser',       img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400' },
  { name: 'Toner',          img: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400' },
  { name: 'Serum/Essence',  img: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Moisturizer',    img: 'https://images.unsplash.com/photo-1608248593842-8d7d4c82b130?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sunscreen',      img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400' },
  { name: 'Eye Care',       img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sheet Mask',     img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400' },
  { name: 'Wash-off Mask',  img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' },
];

export default function ShopByCategory() {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
      <div className="flex gap-4 w-max sm:w-auto sm:grid sm:grid-cols-4 md:grid-cols-8">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center gap-2 group no-underline flex-shrink-0 w-[90px] sm:w-auto"
          >
            <div className="w-[80px] h-[80px] sm:w-full sm:h-[100px] rounded-full overflow-hidden border-2 border-bb-border
              group-hover:border-bb-pink transition-all duration-200 shadow-sm group-hover:shadow-[0_4px_15px_rgba(255,183,197,0.4)]">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-xs font-semibold text-bb-text text-center group-hover:text-bb-pink transition-colors leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
