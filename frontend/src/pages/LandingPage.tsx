import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-churrasco-red/10 via-transparent to-churrasco-orange/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-churrasco-red/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-churrasco-orange/20 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="font-display text-6xl md:text-8xl text-churrasco-red tracking-wider mb-4">
          CHURRASCÔMETRO
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2 font-light">
          Descubra quanto comprar para seu churrasco
        </p>
        <p className="text-churrasco-warm text-lg mb-12">
          sem desperdício
        </p>

        <p className="text-gray-400 mb-12 text-sm md:text-base max-w-md mx-auto">
          Quantos kg de carne? Litros de cerveja? Carvão e gelo?
          Calcule tudo automaticamente com base no número de pessoas e perfil dos convidados.
        </p>

        <Link
          to="/calcular"
          className="inline-block px-12 py-4 bg-churrasco-red hover:bg-churrasco-red/90 text-white font-semibold text-lg rounded-lg transition-all hover:scale-105 shadow-lg shadow-churrasco-red/30"
        >
          Calcular agora
        </Link>
      </div>

      {/* Decorative grill lines */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-churrasco-orange/50 to-transparent" />
    </div>
  );
}
