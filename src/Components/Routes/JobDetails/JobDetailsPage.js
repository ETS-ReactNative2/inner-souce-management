import React, {
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import JobInformation from "./JobInformation";
import MilestonesList from "../../Milestones/MilestonesList";
import Button from "../../Common/Button/Button";
import TabStrip from "../../Common/TabStrip/TabStrip";
import Discussions from "./Discussions";
import Applications from "./Applications";
import { Redirect, withRouter } from "react-router";
import { Route } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import WorkingUsers from "./WorkingUsers";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import LoadingIndicator from "../../Common/LoadingIndicator/LoadingIndicator";
import { GET_JOB_APPLICANTS, GET_JOB_INFO } from "../../../queries";
import {
    APPLY_TO_JOB,
    DELETE_JOB,
    WITHDRAW_JOB_APPLICATION,
} from "../../../mutations";
import { AuthenticationContext } from "../../../hooks/useAuthentication/provider";

const JobDetailsPage = (props) => {

    const jobId = props.match.params.id;

    const { user } = useContext(AuthenticationContext);
    const [getJobData, { loading, error, data}] = useLazyQuery(
        GET_JOB_INFO,
        { variables: { jobId: jobId }, fetchPolicy: "network-only" },
    );

    useEffect(()=> {
        getJobData();
        return(() => {});
    }, [

    ]);
    console.log(data);


    //Mutation for applying to a job
    const [applyToJobMutation, { applyToJobLoading, applyToJobError }] = useMutation(
        APPLY_TO_JOB, {
            refetchQueries: [

                {
                    query: GET_JOB_APPLICANTS,
                    variables: { jobId: jobId },
                },
            ],
        });
    //Mutation for deleting a job
    const [deleteJobMutation, { deleteJobLoading, deleteJobError }] = useMutation(
        DELETE_JOB, {
            refetchQueries: [
                {
                    query: GET_JOB_INFO,
                    variables: { jobId: jobId },
                },
            ],
        });
    //Mutation for withdrawing a job application
    const [withdrawApplicationMutation, { withdrawApplicationLoading, withdrawApplicationError }] = useMutation(
        WITHDRAW_JOB_APPLICATION,
        {
            refetchQueries: [
                {
                    query: GET_JOB_APPLICANTS,
                    variables: { jobId: jobId },
                },
                {
                    query: GET_JOB_INFO,
                    variables: { jobId: jobId },
                },
            ],
        });


    //Query to get the job tabs and primary info(created by, applicant IDs)
    console.log("loading", loading && data == null && error == null);
    if ((loading || data == null) && !error) {
        return <LoadingIndicator/>;
    }

    if (error) {
        return "Error loading job";
    }

    const applyToJobHandler = () => {
        applyToJobMutation({
            variables: {
                jobId: jobId,
            },
        },
        ).catch((e) => {
            alert("Could not apply to job");
        });
    };

    // ToDo implement Modal for getting password
    const deleteJobHandler = () => {
        let confirmed = window.confirm(
            "Are you sure you want to delete this job? Note: all the associated milestones, discussions and applications will be lost.");
        if (confirmed) {
            deleteJobMutation({
                variables: {
                    jobId: jobId,
                },
            }).then(
                () => {
                    props.history.push("/");
                },
            ).catch((e) => {
                alert("Could not delete job", e);
            });
        }
    };

    const withdrawApplicationHandler = () => {
        let confirmed = window.confirm(
            "Are you sure you want to withdraw from this job?");
        if (confirmed) {
            withdrawApplicationMutation({
                variables: {
                    jobId: jobId,
                },
            },
            ).catch(() => {
                alert("Could not delete job");
            });
        }
    };


    const viewerApplied = data.Job.viewerHasApplied;

    let viewerApplicationStatus = "";

    if (data.Job.applications.applications) {
        const application =  data.Job.applications.applications.find(
            (application) => (application.applicant.id === user.id));
        if (application) {
            viewerApplicationStatus = application.status.toUpperCase();
        }
    }

    console.log(viewerApplicationStatus);
    //To check if the user has already applied to this job for buttons
    let userActions = [];
    let isJobAuthor = false;
    // If the user has applied to this job and user's application has not been accepted
    if (data.Job.viewerHasApplied && viewerApplicationStatus ==="PENDING" ) {
        userActions = [
            (<Button type="secondary" label="Withdraw application"
                key="withdrawJobApplication"
                className=" w-auto mr-4 "
                onClick={withdrawApplicationHandler}
            />),
        ];
    }

    // If the user has applied to this job and if the application has been accepted
    else if (data.Job.applications.applications && viewerApplicationStatus === "ACCEPTED") {
        userActions = [
            (<Button type="secondary" label="Leave Job"
                key="leaveJob"
                className=" w-auto mr-4 "
                onClick={withdrawApplicationHandler}
            />),
        ];
    } else {
        userActions = [
            (<Button type="primary" label="Apply to Job"
                key="applyjob"
                className=" w-auto mr-4 "
                onClick={applyToJobHandler}
            />),
        ];
    }

    const authorActions = [
        (<Button type="secondary" label="Edit Job"
            key="editjob"
            className=" w-auto mr-4 "
            onClick={() => props.history.push("/editJob/" + jobId)}
        />),
        (<Button type="error" label="Delete Job"
            className=" w-auto mr-4 "
            key="deletejob"
            onClick={deleteJobHandler}
        />),
    ];
    //To check if the user is the author of the job
    if (user.id === data.Job.createdBy.id) {
        isJobAuthor = true;
    }

    let tabList = [
        {
            title: "Milestones",
            location: "milestones",
            count: data.Job.milestones.totalCount
                ? data.Job.milestones.totalCount
                : 0,
        },
        {
            title: "Discussions",
            location: "discussions",
            count: data.Job.discussion.totalCount
                ? data.Job.discussion.totalCount
                : 0,
        },
    ];
    // Only the author of the job can view applications and currently working tab
    if (isJobAuthor) {
        tabList.push({
            title: "Applications",
            location: "applications",
            count: data.Job.applications.pendingCount
                ? data.Job.applications.pendingCount
                : 0,
            notify: true,
        },
        {
            title: "Currently Working",
            location: "working",
            count: data.Job.applications.acceptedCount
                ? data.Job.applications.acceptedCount
                : 0,
        });
    }

    return (
        <Fragment>
            <div
                className="px-4 pb-24 max-w-screen-lg min-h-screen mx-auto lg:px-10">
                <button onClick={() => { props.history.goBack(); }}
                    className="flex py-4 hover:text-nebula-blue">
                    <ArrowLeft/>
                    <p className="px-4">Back</p>
                </button>
                < JobInformation jobId={jobId}/>
                <TabStrip tabs={tabList}/>
                {
                    location.pathname === ("/jobDetails/" + jobId) ?
                        <Redirect to={props.match.url + "/milestones"}/> : ""
                }
                <Route exact
                    path={props.match.url + "/milestones"}
                    component={(props) => <MilestonesList jobId={jobId}
                        isJobAuthor={isJobAuthor}
                        createdBy={data.Job.createdBy}/>}
                />
                <Route exact path={props.match.url + "/discussions"}
                    component={(props) => <Discussions jobId={jobId}/>}/>
                {
                    isJobAuthor
                        ?
                        <Fragment>
                            <Route exact path={props.match.url + "/applications"}
                                component={()=> <Applications
                                    jobId={jobId}/>}/>
                            <Route exact path={props.match.url + "/working"}
                                component={() => <WorkingUsers
                                    jobId={jobId}/>}/>
                        </Fragment>
                        :
                        ""
                }
            </div>
            <div className="bottom-0 sticky bg-white">
                <hr/>
                <div
                    className="px-4 flex flex-wrap-reverse items-center max-w-screen-lg mx-auto py-4 lg:px-10">
                    <div className="flex">
                        {isJobAuthor ? authorActions : userActions}
                    </div>
                    <div>
                        <p
                            className="text-sm font-semibold text-nebula-blue"
                        >
                            {(!isJobAuthor && viewerApplicationStatus === "PENDING") &&
                              "Successfully applied to the job"
                            }
                            {(!isJobAuthor && viewerApplicationStatus === "ACCEPTED") &&
                              "Yay! Your application has been accepted!"
                            }
                        </p>
                        <p
                            className="text-sm font-semibold text-nebula-grey-600"
                        >
                            {(!isJobAuthor && viewerApplicationStatus === "PENDING") &&
                            "Please wait for the author to respond to your application."
                            }
                            {(!isJobAuthor && viewerApplicationStatus === "ACCEPTED") &&
                            "Please stay in touch with the author to collaborate."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default (withRouter(JobDetailsPage));
