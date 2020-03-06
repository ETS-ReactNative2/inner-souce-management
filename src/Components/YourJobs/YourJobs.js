import React, { Component, Fragment } from 'react';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import OngoingJobs from './OngoingJobs';
import JobList from "../JobList";
import { ongoing, completed, applications } from "../../../assets/placeholder";

class YourJobs extends Component {
    render() {
        return (
            <Fragment>
                <Sidebar page="yourJobs" />
                <div className="w-full lg:w-4/5 lg:mx-10">
                    <div className="px-4 lg:px-0">
                        <Navbar />
                    </div>
                    <div className="h-auto mt-4">
                        <OngoingJobs title={ongoing} />
                        <JobList title={applications} setModalState={this.props.setModalState} />
                        <JobList title={completed} setModalState={this.props.setModalState} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default YourJobs;