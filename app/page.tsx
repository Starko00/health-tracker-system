import LoginForm from "@/components/functional/login-form";
import { GoogleSignInBtn } from "@/components/functional/signin-btn";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid  container  grid-rows-8 mx-auto place-items-center h-screen  border-collapse">
      <div className="row-span-0 md:row-span-2  grid h-full grid-cols-8 grid-rows-1 border-t border-border w-full">
        <div className="col-span-0 before:content-[' '] before:bg-background  before:flex before:items-center before:justify-center border-l before:absolute before:-bottom-1.5  before:-left-1.5 before:w-3 before:ring-8 before:ring-background before:border before:h-3  before:text-green-900 before:z-[1] before:rounded-full md:col-span-2 md:h-full  border-r border-border relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-bottom-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full "></div>
        <div className="col-span-8 md:col-span-4 md:h-full  border-r border-border relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-bottom-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full "></div>
        <div className="col-span-0 md:col-span-2 md:h-full  border-border border-r relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-bottom-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full"></div>
      </div>

      <div className="row-span-full md:row-span-4 grid h-full grid-cols-8 grid-rows-1 border-t border-border w-full">
        <div className="col-span-0 md:col-span-2 h-full border-l before:content-[' '] before:bg-background  before:flex before:items-center before:justify-center before:absolute before:-top-1.5 before:-right-1.5 before:w-3 before:ring-8 before:ring-background before:border before:h-3  before:text-green-900 before:z-[1] before:rounded-full border-r border-border"></div>
        <div className=" z-10 md:p-4  row-span-full md:row-span-4 col-span-full h-full md:col-span-4">
          <div className=" flex-col border h-full p-4 rounded-md bg-white shadow-md w-full items-center justify-center  flex place-items-center gap-4  relative ">
            {/* <Image src={'/gradient.png'} className="absolute top-0 left-0 w-full  z-[-1]" alt='Gradient-bg' width={100} height={100}  /> */}

            <Image src={"/logo-icon.svg"} alt="Logo" width={100} height={100} />
            <h1 className="text-2xl font-bold max-w-sm text-center ">Welcome to the Dashboard</h1>
            <p className="text-sm text-gray-500 mb-8 max-w-sm text-center">Sign in to continue</p>
            <div className="max-w-sm w-full">
              <LoginForm />
              <GoogleSignInBtn />
            </div>
          </div>
        </div>
        <div className="col-span-0 md:col-span-2 md:h-full  border-border border-l border-r relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-bottom-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full"></div>

      </div>
      <div className="row-span-0 md:row-span-2  grid h-full grid-cols-8 grid-rows-1 border-t border-border w-full">
        <div className="col-span-0 md:col-span-2 h-full border-l before:content-[' '] before:bg-background  before:flex before:items-center before:justify-center before:absolute before:-top-1.5 before:-left-1.5 before:w-3 before:ring-8 before:ring-background before:border before:h-3  before:text-green-900 before:z-[1] before:rounded-full  border-r border-border relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-top-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full "></div>
        <div className="col-span-8 md:col-span-4 h-full  border-r border-border relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-top-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full "></div>
        <div className="col-span-0 md:col-span-2 md:h-full  border-border border-r relative after:content-[' '] after:bg-background  after:flex after:items-center after:justify-center after:absolute after:-top-1.5 after:-right-1.5 after:w-3 after:ring-8 after:ring-background after:border after:h-3  after:text-green-900 after:z-[1] after:rounded-full"></div>


      </div>
    </div>
  );
}

//  before:content-[' '] before:bg-background  before:flex before:items-center before:justify-center before:absolute before:-top-1.5 before:-right-1.5 before:w-3 before:ring-8 before:ring-background before:border before:h-3  before:text-green-900 before:z-[1] before:rounded-full