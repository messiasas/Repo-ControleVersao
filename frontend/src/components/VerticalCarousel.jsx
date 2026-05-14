import { useEffect, useState } from "react";
import { customersData } from "../data/customersData.js";

function VerticalCarousel({ setCurrentCustomer }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  // cliente atual
  const currentCustomer = customersData[currentIndex];

  // próximo slide
  const nextSlide = () => {

    setCurrentIndex((prev) =>
      prev === customersData.length - 1
        ? 0
        : prev + 1
    );

  };

  // slide anterior
  const prevSlide = () => {

    setCurrentIndex((prev) =>
      prev === 0
        ? customersData.length - 1
        : prev - 1
    );

  };

  // autoplay
  useEffect(() => {

    const interval = setInterval(() => {

      nextSlide();

    //   o React pode capturar estado antigo dependendo da renderização.

    //     A forma MAIS segura é:

    //     useEffect(() => {

    //     const interval = setInterval(() => {

    //         setCurrentIndex((prev) =>
    //         prev === customersData.length - 1
    //             ? 0
    //             : prev + 1
    //         );

    //     }, 4000);

    //     return () => clearInterval(interval);

    //     }, []);



    }, 4000);

    return () => clearInterval(interval);

  }, []);

  // monitoramento/log
  useEffect(() => {

    setCurrentCustomer(currentCustomer);

    console.log("Cliente atual:");
    console.log(currentCustomer);

  }, [currentCustomer, setCurrentCustomer]);

  return (

    <div className="vertical-carousel">

      {/* seta cima */}
      <button
        className="arrow up"
        onClick={prevSlide}
      >
        ▲
      </button>

      {/* imagem */}
      <img
        src={currentCustomer.imagem}
        alt={currentCustomer.nome}
        className="carousel-image"
      />

      {/* seta baixo */}
      <button
        className="arrow down"
        onClick={nextSlide}
      >
        ▼
      </button>

    </div>

  );
}

export default VerticalCarousel;