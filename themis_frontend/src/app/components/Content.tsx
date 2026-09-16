import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Sparkles, Search, Clock, CheckCircle2 } from 'lucide-react';

/**
 * Componente de contenido principal.
 *
 * Este componente renderiza el contenido informativo y funcional del sitio, permitiendo a los usuarios
 * generar, consultar y gestionar reportes.
 *
 * @component
 * @returns {JSX.Element} El contenido principal de la aplicación.
 */
const Content = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const authUser = useSelector((state: RootState) => state.auth?.user);

  
  const features = [
    {
      id: 1,
      title: "Consulta de Novedades",
      description: "Accede y consulta todas las novedades o reportes realizados por ti para mantener un seguimiento efectivo.",
      icon: Search,
      gradient: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 2,
      title: "Seguimiento en tiempo real",
      description: "Consulta las actualizaciones de tus reportes y mantente informado del estado de cada proceso.",
      icon: Clock,
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: 3,
      title: "Gestión completa",
      description: "Realiza un seguimiento detallado de cada novedad hasta obtener una respuesta o resolución.",
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  return (
    <div className="w-full font-sans">
      <div className={`relative bg-gradient-to-r ${darkMode ? "from-[#00304D] via-[#004d7a] to-[#005386]" : "from-[#2d7a0e] via-[#398f0d] to-[#4da916]"} rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-2xl overflow-hidden`}>
        {/* Efecto de brillo decorativo (oculto en pantallas pequeñas) */}
        <div className="hidden md:block absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="hidden md:block absolute bottom-0 left-0 w-36 md:w-48 h-36 md:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto pr-0 sm:pr-8 lg:pr-40">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
              Bienvenido a Themis, {authUser?.person?.name || "Usuario"}
            </h2>
          </div>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-full sm:max-w-3xl text-pretty">
            Aquí podrás gestionar todas las novedades de manera controlada y organizada, optimizando así tu tiempo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
              <div className={`mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.iconColor}`} />
              </div>

              <div className="flex items-start gap-2 mb-3">
                <span className={`text-2xl sm:text-3xl font-bold ${feature.iconColor} opacity-20`}>
                  {feature.id}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white pt-1 text-balance">
                  {feature.title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-pretty text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 border-l-4 border-[#398f0d] dark:border-[#005386] shadow-xl overflow-hidden">
          <div className="hidden sm:block absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#398f0d]/5 dark:bg-[#005386]/5 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#398f0d]/10 dark:bg-[#005386]/10 flex items-center justify-center">
              <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-[#398f0d] dark:text-[#005386]" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed pt-1 sm:pt-2 text-pretty">
              Esperamos ser tu aliado fiel, donde la comodidad y la eficiencia se unan para mejorar los procesos de novedades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
