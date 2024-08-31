

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-black" data-bs-theme="dark">
            <div className="container">
                <a className="navbar-brand" href="#"><img src="logotodo.png" alt="" /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/inicio">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/tareas">Lista de Tareas</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Tablas
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="/usuarios">Usuarios</a></li>
                                <li><a className="dropdown-item" href="/tipodetarea">Tipo de Tarea</a></li>
                            </ul>
                        </li>
                
                    </ul>
                   
                </div>
            </div>
        </nav>

    )
}

export default Header