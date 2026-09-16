import React, { Suspense } from "react";
import LoadingBar from "../../../LoadingBar";
import Link from "next/link";
import Image from "next/image";
import Graphic from "../../../Graphics";
import MonthlyReports from "../../../MonthlyReports";
import NoveltiesPerformance from "../../../NoveltiesPerformance";

export default function NovelReport() {
    return (
        <div className="flex flex-col">
            <Link href={"/novelties"}>
                <button type="button" className="bg-[#00324D] hover:bg-[#004366] text-white font-inter font-medium py-2 px-12 rounded mx-2 my-2 ml-10 flex items-center space-x-2">
                    <Image src="/icons/arrow-left.svg" width={20} height={20} alt="View" className="mr-2 invert-item" />
                    Volver
                </button>
            </Link>
            <div className="flex justify-center items-center flex-wrap py-5 space-x-20 space-y-8">
                <div className="flex justify-end items-end mb-4">
                    <Suspense fallback={<LoadingBar />}>
                        <Graphic />
                    </Suspense>
                </div>
                <div className="flex justify-start items-start flex-wrap mb-4">
                    <Suspense fallback={<LoadingBar />}>
                        <MonthlyReports />
                    </Suspense>
                </div>
                <div className="flex justify-center items-center w-full">
                    <Suspense fallback={<LoadingBar />}>
                        <NoveltiesPerformance />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
