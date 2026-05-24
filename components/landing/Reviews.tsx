import { Star } from 'lucide-react'

const REVIEWS = [
  {
    quote: "Da quando uso GuideHost non ricevo più messaggi alle 11 di sera per chiedere come si accende il riscaldamento. Una vera svolta per me.",
    author: "Marco T.",
    role: "Superhost a Roma",
  },
  {
    quote: "Gli ospiti adorano trovare tutto sul loro telefono senza dover scaricare nulla. Le mie recensioni sulla comunicazione sono fisse a 5 stelle.",
    author: "Elena S.",
    role: "Property Manager",
  }
]

export function Reviews() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Scelto dai migliori host in Italia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-slate-700 mb-8 font-medium italic">
                  "{review.quote}"
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900">{review.author}</div>
                <div className="text-slate-500 text-sm">{review.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
