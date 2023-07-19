export default function RightSidebar() {
    return (
        <>
            <div className="right-sidebar">
                <div className="slimscrollright">
                    <div className="rpanel-title"> Service Panel <span><i className="ti-close right-side-toggle"></i></span> </div>
                    <div className="r-panel-body">
                        <ul id="themecolors" className="m-t-20">
                            <li><b>With Light sidebar</b></li>
                            <li><a href="#" data-skin="skin-default" className="default-theme">1</a></li>
                            <li><a href="#" data-skin="skin-green" className="green-theme">2</a></li>
                            <li><a href="#" data-skin="skin-red" className="red-theme">3</a></li>
                            <li><a href="#" data-skin="skin-blue" className="blue-theme">4</a></li>
                            <li><a href="#" data-skin="skin-purple" className="purple-theme">5</a></li>
                            <li><a href="#" data-skin="skin-megna" className="megna-theme">6</a></li>
                            <li className="d-block m-t-30"><b>With Dark sidebar</b></li>
                            <li><a href="#" data-skin="skin-default-dark" className="default-dark-theme working">7</a></li>
                            <li><a href="#" data-skin="skin-green-dark" className="green-dark-theme">8</a></li>
                            <li><a href="#" data-skin="skin-red-dark" className="red-dark-theme">9</a></li>
                            <li><a href="#" data-skin="skin-blue-dark" className="blue-dark-theme">10</a></li>
                            <li><a href="#" data-skin="skin-purple-dark" className="purple-dark-theme">11</a></li>
                            <li><a href="#" data-skin="skin-megna-dark" className="megna-dark-theme ">12</a></li>
                        </ul>
                        <ul className="m-t-20 chatonline">
                            <li><b>Chat option</b></li>
                            <li>
                                <a href="#"><i className="ti-user"></i> <span>Varun Dhavan <small className="text-success">online</small></span></a>
                            </li>
                            <li>
                                <a href="#"><i className="ti-user"></i> <span>Genelia Deshmukh <small className="text-warning">Away</small></span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}