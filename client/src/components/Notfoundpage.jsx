import { Link, useNavigate } from "react-router-dom";

function Notfoundpage() {
  const navigate=useNavigate();
  return (
    <>
    <div className="h-screen wfull flex flex-col justify-center items-center bg-orange-50">
        <h1 className="text-9xl font-bold text-orange-500">404</h1>
        <div className="text-orange-500 px-2 text-sm rounded font-semibold absolute rotate-12 bg-orange-50 ">
            Page not found ...
        </div>
       
        <button className="mt-5" onClick={()=>navigate(-1)}>
       <Link to="/" className="relative inline-orange-50 text-sm text-orange-50  bg-orange-500 font-medium p-4 rounded-lg hover:text-orange-500 hover:bg-orange-50 group active:text-orange-700 focus:outline-none focus-ring">
            <span className="relative black px-4 border-current">Go Back</span>
        </Link>
        </button>

    </div>
      
    </>
  )
}

export default Notfoundpage;

