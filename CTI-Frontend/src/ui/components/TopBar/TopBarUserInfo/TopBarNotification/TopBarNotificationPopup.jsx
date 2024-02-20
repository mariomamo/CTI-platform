import TopBarNotification from "./TopBarNotification.jsx";
import useTopBarHook from "../../UseTopBarHook.jsx";

const TopBarNotificationPopup = ({templatePageHook})=> {
    const topBarHook = useTopBarHook();

    return (
        <li className="nav-item border-right dropdown notifications pointer-cursor" onClick={templatePageHook.handleNotificationBoxClick}>
            <a className="nav-link nav-link-icon text-center" role="button"
               id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="nav-link-icon__wrapper">
                    <i className="material-icons"></i>
                    {topBarHook.notificationNumber ?
                        <span className="badge badge-pill badge-danger">{topBarHook.notificationNumber}</span> : null
                    }
                </div>
            </a>
            <div className={"dropdown-menu dropdown-menu-small " + templatePageHook.notificationBoxClassName} style={{right: "10px !important"}} aria-labelledby="dropdownMenuLink">
                <TopBarNotification title="Analytics" text="Your website’s active users count increased by 28% in the last week. Great job!" icon=""/>
                <TopBarNotification title="Sales" text="Last week your store’s sales count decreased by 5.52%. It could have beenworse!" icon=""/>
                <a className="dropdown-item notification__all text-center">
                    View all Notifications
                </a>
            </div>
        </li>
    )
}

export default TopBarNotificationPopup;