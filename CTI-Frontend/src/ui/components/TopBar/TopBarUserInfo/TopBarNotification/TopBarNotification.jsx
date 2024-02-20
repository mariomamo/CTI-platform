const TopBarNotification = ({title, text, icon})=> {
    return (
        <a className="dropdown-item">
            <div className="notification__icon-wrapper">
                <div className="notification__icon">
                    <i className="material-icons">{icon}</i>
                </div>
            </div>
            <div className="notification__content">
                <span className="notification__category">{title}</span>
                <p>
                    {text}
                </p>
            </div>
        </a>
    )
}

export default TopBarNotification;