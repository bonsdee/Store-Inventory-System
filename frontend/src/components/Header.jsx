import "./../styles/header.css";

import { Bell } from "lucide-react";


function Header(){

  return (

    <header className="header">


      <div className="header-logo">
        Store Inventory
      </div>



      <div className="header-right">


        <div className="notification">
          <Bell size={20}/>
        </div>



        <div className="user-info">

          <div className="user-avatar">
            JD
          </div>


          <span className="user-name">
            Jivonz
          </span>


        </div>


      </div>


    </header>

  )

}


export default Header;