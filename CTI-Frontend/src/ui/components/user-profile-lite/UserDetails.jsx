import React from "react";
import PropTypes from "prop-types";
import Card from "../shard-dashboard/card/Card.jsx";
import CardHeader from "../shard-dashboard/card/CardHeader.jsx";
import ListGroup from "../shard-dashboard/list-group/ListGroup.jsx";
import ListGroupItem from "../shard-dashboard/list-group/ListGroupItem.jsx";
import Progress from "../shard-dashboard/progress/Progress.jsx";
import "./UserDetails.css";
import classNames from "classnames";

const UserDetails = ({ userDetails, isLoading }) => {

  const progressBarClassName = classNames(
      `progress-wrapper`,
      isLoading && `loading-skeleton`
  );

  return (
      <Card small className="mb-4 pt-3">
        <CardHeader className="border-bottom text-center">
          <div className="mb-3 mx-auto">
            <img
                className="rounded-circle"
                src={userDetails.avatar}
                alt={userDetails.name}
                width="250"
            />
          </div>
          <h4 className="mb-0">{userDetails.name}</h4>
          {/*<span className="text-muted d-block mb-2">{userDetails.jobTitle}</span>*/}
          {/*<Button pill outline size="sm" className="mb-2">*/}
          {/*  <i className="material-icons mr-1">person_add</i> Follow*/}
          {/*</Button>*/}
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="px-4">
            <div className={progressBarClassName}>
              <strong className="text-muted d-block mb-2 days-from-sub">
                Remaining subscription days ({userDetails.daysFromSubscription})
              </strong>
              <Progress className="progress-sm" value={userDetails.daysFromSubscription}>
              <span className="progress-value">
                {userDetails.daysFromSubscriptionInPercentage}%
              </span>
              </Progress>
            </div>
          </ListGroupItem>
          {/*<ListGroupItem className="p-4">*/}
          {/*  <strong className="text-muted d-block mb-2">*/}
          {/*    {userDetails.metaTitle}*/}
          {/*  </strong>*/}
          {/*  <span>{userDetails.metaValue}</span>*/}
          {/*</ListGroupItem>*/}
        </ListGroup>
      </Card>
  );
}

UserDetails.propTypes = {
  /**
   * The user details object.
   */
  userDetails: PropTypes.object
};

UserDetails.defaultProps = {
  userDetails: {
    name: "Wallet address",
    avatar: "./CTI/images/eth_profile_pic.png",
    // jobTitle: "Project Manager",
    // performanceReportTitle: "Workload",
    daysFromSubscription: 74,
    // metaTitle: "Description",
    // metaValue:
    //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eaque, quidem, commodi soluta qui quae minima obcaecati quod dolorum sint alias, possimus illum assumenda eligendi cumque?"
  }
};

export default UserDetails;
