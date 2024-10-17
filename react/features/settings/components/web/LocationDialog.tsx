import React, { useEffect, useState } from "react";
import { WithTranslation } from "react-i18next";
import { connect } from "react-redux";

import { translate } from "../../../base/i18n/functions";
import Dialog from "../../../base/ui/components/web/Dialog";
import Button from "../../../base/ui/components/web/Button";

/**
 * The type of {@link LogoutDialog}'s React {@code Component} props.
 */
interface IProps extends WithTranslation {
    /**
     * Logout handler.
     */
    onLogout: () => void;
}
type Participant = {
    display_name: string;
    userType: null;
    longitude: number;
    latitude: number;
};
/**
 * Implements the Logout dialog.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
function LocationDialog({ onLogout, t }: IProps) {
    const [participants, setParticipant] = useState([]);
    useEffect(() => {
        const url =
            "https://tab-qa.techextensor.com/api/v1/CRUD/DSQ/Meeting_Event/ParticipantJoin_Meeting_Event";

        const headers = {
            applicationcode: "phoenix",
            authorization:
                "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzeXN0ZW0udXNlckB0ZWNoZXh0ZW5zb3IuY29tIiwianRpIjoiN2RkOGE0ZGMtZTNiNy00MzU4LWFhYWEtZjZlZTc3OTkzMTgyIiwiZW1haWwiOiJzeXN0ZW0udXNlckB0ZWNoZXh0ZW5zb3IuY29tIiwiaWQiOiJhOTZmYTc0ZS03MDE3LTQwYWUtOWRjNy05NmZhYzU2NzY2MDYiLCJsb2NhbGVTZXR0aW5nIjoie1wiVGltZVpvbmVJZFwiOm51bGwsXCJMb2NhbGVcIjowLFwiTGFuZ3VhZ2VcIjowLFwiRGF0ZUZvcm1hdFwiOm51bGwsXCJUaW1lRm9ybWF0XCI6bnVsbCxcIk51bWJlckZvcm1hdFwiOm51bGwsXCJDdXJyZW5jeVwiOm51bGx9Iiwicm9sZSI6IkFkbWluaXN0cmF0b3IiLCJSb2xlSWRzIjoiMkNCNDMxQTYtNTFFRS00NjNFLTg0MEMtM0ExOEM1RkU5MTUwIiwibmJmIjoxNzEyOTAzMzE2LCJleHAiOjE3NDQ0MzkzMTYsImlhdCI6MTcxMjkwMzMxNn0.QAHeBhx522ZyPsg7LXtPCW57m5fRr1c90JGb_2_zpgo",
            "content-type": "application/json",
        };

        const body = {
            AppObjectName: "Meeting_Event",
            DSQName: "ParticipantJoin_Meeting_Event",
            Reqtokens: {
                MeetingId: "45312E77-C2C5-4164-8AB4-634B43DCC5E0",
            },
        };

        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setParticipant(data.Result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const submit = (participantsData: Participant)=>{
        alert("submit")
           var requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
          };
          fetch(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              Number(participantsData.latitude) +
              "," +
              Number(participantsData.longitude) +
              "&sensor=true&key=***REMOVED***",
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              alert(result)
            })
    }
    return (
        <Dialog
            ok={{ translationKey: "dialog.Yes", hidden: true }}
            cancel={{ hidden: true }}
            onSubmit={onLogout}
            titleKey={"Participant"}
            size={"large"}
        >
            {participants ? (
                participants.map(
                    ({
                        ID,
                        MeetingId,
                        Payload,
                    }: {
                        ID: string;
                        MeetingId: string;
                        Payload: string;
                    }) => {
                        var participantsData: Participant = JSON.parse(Payload);
                        var hasLatLog =
                            participantsData.latitude != 0 &&
                            participantsData.longitude != 0 &&
                            participantsData.latitude != null &&
                            participantsData.longitude != null &&
                            participantsData.latitude != undefined &&
                            participantsData.longitude != undefined;
                            if (!hasLatLog) {
                                participantsData.latitude = -76.989887
                                participantsData.longitude = 42.5254578
                            }
                        return (
                            <>
                                <div
                                    style={{
                                        justifyContent: "space-between",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>{participantsData.display_name}</div>
                                    <Button
                                        accessibilityLabel={
                                            hasLatLog
                                                ? "View location"
                                                : "Permission not shered"
                                        }
                                        id="modal-dialog-ok-button"
                                        isSubmit={true}
                                        labelKey={
                                            hasLatLog
                                                ? "View location"
                                                : "Permission not shered"
                                        }
                                        // disabled={!hasLatLog}
                                        onClick={()=>submit(participantsData)}
                                        // { ...(!ok.disabled && { onClick: submit }) }
                                    />
                                </div>
                                <div
                                    className="separator-line"
                                    style={{
                                        margin: "12px 0px 12px -20px",
                                        padding: "0px 20px",
                                        width: "100%",
                                        height: "1px",
                                        background: "#5e6d7a",
                                    }}
                                />
                            </>
                        );
                    }
                )
            ) : (
                <div>Getting participants data.</div>
            )}
        </Dialog>
    );
}

export default translate(connect()(LocationDialog));
