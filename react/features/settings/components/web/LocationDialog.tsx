import React, { useEffect, useState, useRef } from "react";
import { WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';

import { translate } from "../../../base/i18n/functions";
import Dialog from "../../../base/ui/components/web/Dialog";
import Button from "../../../base/ui/components/web/Button";
import { hideDialog } from "../../../base/dialog/actions";
import { openUserLocationDialog } from "../../actions.web";
import { set } from "lodash";

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
    address: string;
    token : string
};
interface ApiResponse {
    token: string;
    api: string;
  }
  async function fetchApiCall(url: string): Promise<ApiResponse> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            "content-type": "application/json",
          },
        mode: "cors"
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: ApiResponse = await response.json();
  
      // Ensure the response contains the required keys
      if (!data.token || !data.api) {
        throw new Error('Invalid response structure: Missing token or api key');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching API:', error);
      throw error;
    }
  }
  
/**
 * Implements the Logout dialog.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
function LocationDialog({ onLogout, t }: IProps) {
    const [participants, setParticipant] = useState([]);
    const [token, setToken] = useState("");
    const [api, setApi] = useState("");

    const dispatch = useDispatch();
 

    useEffect(() => {
        fetchApiCall('https://wfpftp.techextensor.com/phoenix_jitsi_qa_token.json')
        .then((data) => {
          console.log('Token:', data.token);
          console.log('API:', data.api);
          setToken(data.token)
          setApi(data.api)
          var localToken = data.token
          
          const url =
              "https://tab-qa.techextensor.com/api/v1/CRUD/DSQ/Meeting_Event/ParticipantJoin_Meeting_Event";
  
          const headers = {
              applicationcode: "phoenix",
              authorization:localToken,
              "content-type": "application/json",
          };
          const meetingID = window.sessionStorage.getItem("meetingID")
  
          const body = {
              AppObjectName: "Meeting_Event",
              DSQName: "ParticipantJoin_Meeting_Event",
              Reqtokens: {
                  MeetingId:meetingID || "78d9fcd2-4220-423d-bf78-d64b15313149",
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
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
        
    }, []);

    const submit = (participantsData: Participant) => {
        // dispatch(hideDialog());
        // dispatch after 2 seconds
      
        var requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };

        fetch(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                Number(participantsData.latitude) +
                "," +
                Number(participantsData.longitude) +
                "&sensor=true&key="+api, // Replace with your actual API keys
            requestOptions
        )
            .then((response) => response.json()) // Parse the response as JSON
            .then((result) => {
                if (result.status === "OK" && result.results.length > 0) {
                    const formattedAddress =
                        result.results[0].formatted_address;
                    console.log("Formatted Address:", formattedAddress,token);
                    // alert(formattedAddress);
                    participantsData.address = formattedAddress;
                    participantsData.token = token;
                    // setTimeout(() => {
                    // }, 1000);
                    dispatch(hideDialog());
                    dispatch(openUserLocationDialog(participantsData));

                } else {
                    console.error(
                        "No address found or API error:",
                        result.status
                    );
                    alert("No address found or API error");
                }
            })
            .catch((error) => {
                console.error("Error fetching the address:", error);
                alert("Error fetching the address");
            });
    };
    return (
        <>
            <Dialog
                ok={{ translationKey: "dialog.Yes", hidden: true }}
                cancel={{ hidden: true }}
                onSubmit={onLogout}
                titleKey={"Participant"}
                size={"large"}
            >
                {participants && (
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
                            var participantsData: Participant =
                                JSON.parse(Payload);
                            console.log("participantsData", participantsData);
                            var hasLatLog =
                                participantsData.latitude != 0 &&
                                participantsData.longitude != 0 &&
                                participantsData.latitude != null &&
                                participantsData.longitude != null &&
                                participantsData.latitude != undefined &&
                                participantsData.longitude != undefined;
                            if (!hasLatLog) {
                                participantsData.latitude = 23.0225;
                                participantsData.longitude = 72.5714;
                                hasLatLog = true;
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
                                        <div>
                                            {participantsData.display_name}
                                        </div>
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
                                            onClick={() =>
                                                submit(participantsData)
                                            }
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
                ) }
                 {}
                 {/* <div
                ref={divRef}
                style={{
                    position: "absolute",
                    zIndex: 9,
                    backgroundColor: "#f1f1f1",
                    textAlign: "center",
                    border: "1px solid #d3d3d3",
                }}
            >
                <div
                    ref={headerRef}
                    style={{
                        padding: "10px",
                        cursor: "move",
                        zIndex: 10,
                        backgroundColor: "#2196F3",
                        color: "#fff",
                    }}
                    onMouseDown={dragMouseDown}
                >
                    Click here to move
                </div>
                <p>Move</p>
                <p>this</p>
                <p>DIV</p>
            </div> */}
            </Dialog>
           
        </>
    );
}

export default translate(connect()(LocationDialog));
