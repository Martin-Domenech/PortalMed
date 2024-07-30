import React from "react"
import "./Sidebar.css"

export default function Sidebar (){

    return(
        <header>
            <div id="sidemenu" className="menu_collapsed">
                <div id="profile">
                    <div id="photo">
                        <img src="./assets/logo-portalmed.png" alt="logo" />
                    </div>
                    <a href="{% url 'inicio' %}" id="user"><span>USUARIO</span></a>
                </div>

                <div id="menu-items">
                    <div className="item">
                        <a href="#">
                            <div className="icon"></div>
                            <div className="title">Pacientes</div>
                        </a>
                    </div>
                    
                    <div className="item">
                        <p>logout</p>
                    </div>
                </div>
            </div>
        </header>
    )
}