'use client'

import React from "react";
import Image from "next/image";
import Content from "../../../Content";

const MainContent = () => (
  <div className="flex flex-col lg:flex-row gap-8">
    <div className="flex-1 transition-all duration-300">
      <Content />
    </div>
    <div className="lg:w-1/3 flex justify-center items-start lg:sticky lg:top-20 self-start">
      <div className="relative group">
        <div className="relative">
          <Image
            className="pt-20  transition-transform duration-500 group-hover:scale-105"
            src="/img/exp.png"
            width={300}
            height={300}
            alt="Icono de experiencia"
            title="Icono de experiencia"
          />
        </div>
      </div>
    </div>
  </div>
);

export default MainContent;
