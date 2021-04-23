import React from "react";
import { collections } from "../../config/collections.config";
import { AppLayoutRoot } from "../styles";
import logo from "../../images/munay-logo.svg";
import { RootState } from "../../redux";
import { connect, ConnectedProps } from "react-redux";
import { logoutUser } from "../../redux/authentication/actions";
import FeedbackDialog from "../../components/Util/FeedbackDialog";

interface Props extends AppLayoutReduxProps {
  children: React.ReactNode;
}

const AppLayout = ({ children, activeCollectionLabel, logoutFn }: Props) => {
  return (
    <React.Fragment>
      <AppLayoutRoot
        logoutFn={logoutFn}
        label={activeCollectionLabel}
        logo={logo}
        sidebarItems={collections}
      >
        {children}
      </AppLayoutRoot>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeCollectionID: state.activeCollection.itemID,
  activeCollectionPath: state.activeCollection.routerPath,
  activeCollectionLabel: state.activeCollection.sidebarLabel,
});

const mapDispatchToProps = {
  logoutFn: logoutUser,
};

const appLayoutConnector = connect(mapStateToProps, mapDispatchToProps);

type AppLayoutReduxProps = ConnectedProps<typeof appLayoutConnector>;

export default appLayoutConnector(AppLayout);
