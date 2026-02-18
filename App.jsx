import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, MapPin, Info, ChevronUp, X, Clock } from 'lucide-react';

const AudioGuideApp = () => {
  // --- DATOS DE LA GUÍA ---
  const tracks = [
    {
      id: 1,
      title: "Bienvenida y Contexto",
      subtitle: "Entrada Principal",
      duration: 135, // Duración aproximada en segundos (2:15)
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop",
      // AQUI ESTÁ TU AUDIO REAL:
      audioUrl: "https://pfst.cf2.poecdn.net/base/audio/f44e98f35d3cf5beee681bdd7e379ae8244d74cccc602d181eafcff2fd197dff",
      description: "Inicio del recorrido en la entrada principal. Introducción a la historia de la familia Casals y el entorno natural de Sant Patricí."
    },
    {
      id: 2,
      title: "La Casa y la Leyenda",
      subtitle: "Jardines Exteriores",
      duration: 180,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
      audioUrl: null, // Sin audio real aún
      description: "La historia de Fernando Vives, Virginia López (Chini) y los años dorados de la finca en 1918."
    },
    {
      id: 3,
      title: "El Renacer de la Finca",
      subtitle: "Viñedos y Quesería",
      duration: 150,
      image: "https://images.unsplash.com/photo-1528823872057-9c0182707c01?q=80&w=1000&auto=format&fit=crop",
      audioUrl: null, // Sin audio real aún
      description: "Cómo la familia Casals recuperó la finca de las cenizas y creó el hotel y la bodega actual."
    }
  ];

  // --- ESTADOS ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  // Referencia al elemento de audio HTML
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  // --- EFECTOS Y LOGICA DE AUDIO ---

  // Cuando cambia la pista, cargamos la nueva
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Si la pista tiene URL, la cargamos
      if (currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.load();
      } else {
        // Si no hay URL (pistas 2 y 3), quitamos el source
        audioRef.current.removeAttribute('src');
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!currentTrack.audioUrl) {
      alert("Esta pista aún no tiene audio disponible en esta demo.");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Error al reproducir:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Opcional: Pasar a la siguiente pista automáticamente
    // nextTrack(); 
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative h-screen w-full bg-stone-900 text-white overflow-hidden font-sans">
      
      {/* ELEMENTO DE AUDIO OCULTO (EL MOTOR REAL) */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-stone-900" />
        <img 
          src={currentTrack.image} 
          alt={currentTrack.title} 
          className="w-full h-3/4 object-cover opacity-90 transition-opacity duration-700 ease-in-out"
        />
      </div>

      {/* CABECERA */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full">
          <MapPin className="text-orange-200 w-6 h-6" />
        </div>
        <h1 className="text-sm font-medium tracking-widest uppercase text-white/80">Guía Sant Patricí</h1>
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full">
          <Info className="text-white w-6 h-6" />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL (TARJETA INFERIOR) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-stone-900 rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl h-[45%] flex flex-col justify-between">
        
        {/* INFO PISTA */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-900/30 text-orange-300 text-xs font-bold tracking-wider mb-2 border border-orange-500/20">
            PISTA {currentTrack.id} / {tracks.length}
          </span>
          <h2 className="text-2xl font-serif font-bold text-orange-50">{currentTrack.title}</h2>
          <p className="text-stone-400 text-sm">{currentTrack.subtitle}</p>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="w-full space-y-2 mt-4">
          <input
            type="range"
            min="0"
            max={duration || currentTrack.duration} // Usar duración real si está cargada
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-stone-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || currentTrack.duration)}</span>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex justify-between items-center px-4 mt-2">
          <button onClick={prevTrack} className="text-stone-400 hover:text-white transition">
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="bg-orange-600 hover:bg-orange-500 text-white rounded-full p-6 shadow-lg shadow-orange-900/20 transition transform active:scale-95 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button onClick={nextTrack} className="text-stone-400 hover:text-white transition">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        {/* BOTÓN LISTA */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setShowPlaylist(true)}
            className="flex items-center space-x-2 text-stone-400 text-sm hover:text-orange-300 transition"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Ver lista de pistas</span>
          </button>
        </div>
      </div>

      {/* OVERLAY: LISTA DE REPRODUCCIÓN */}
      {showPlaylist && (
        <div className="absolute inset-0 z-50 bg-stone-900/95 backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom">
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif text-white">Recorrido</h3>
              <button onClick={() => setShowPlaylist(false)} className="p-2 bg-white/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pb-20">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setShowPlaylist(false);
                  }}
                  className={`p-4 rounded-xl flex items-center space-x-4 cursor-pointer transition border ${
                    currentTrackIndex === index 
                      ? 'bg-orange-900/20 border-orange-500/30' 
                      : 'bg-stone-800/50 border-transparent hover:bg-stone-800'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                    {currentTrackIndex === index && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${currentTrackIndex === index ? 'text-orange-300' : 'text-white'}`}>
                      {track.id}. {track.title}
                    </h4>
                    <p className="text-stone-400 text-xs mt-1 line-clamp-1">{track.description}</p>
                  </div>
                  <div className="text-stone-500 text-xs flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioGuideApp;