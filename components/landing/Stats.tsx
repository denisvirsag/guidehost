export function Stats() {
  return (
    <section className="py-20 bg-[#FF5A5F] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">I numeri che contano</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tighter">-70%</div>
            <div className="text-lg md:text-xl font-medium text-white/90">Messaggi dagli ospiti</div>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tighter">10 min</div>
            <div className="text-lg md:text-xl font-medium text-white/90">Tempo medio di setup</div>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
            <div className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tighter">98%</div>
            <div className="text-lg md:text-xl font-medium text-white/90">Ospiti che accedono</div>
          </div>
        </div>
      </div>
    </section>
  )
}
