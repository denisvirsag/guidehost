export function LogoCloud() {
  const PLATFORMS = [
    'Airbnb', 
    'Booking.com', 
    'Vrbo', 
    'Expedia', 
    'TripAdvisor',
    'Hostaway',
    'Beds24'
  ]

  // Double the array for infinite scroll effect
  const TickerItems = [...PLATFORMS, ...PLATFORMS]

  return (
    <div className="py-8 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-4 text-center">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          Utilizzato dagli host su tutte le piattaforme
        </p>
      </div>
      
      <div className="relative w-full flex overflow-x-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        
        {/* Scrolling content */}
        <div className="flex w-fit animate-marquee whitespace-nowrap items-center">
          {TickerItems.map((platform, i) => (
            <div 
              key={i} 
              className="mx-8 md:mx-16 text-2xl md:text-3xl font-extrabold text-slate-300 hover:text-slate-400 transition-colors cursor-default"
            >
              {platform}
            </div>
          ))}
        </div>

        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </div>
  )
}
