import React, { useEffect, useRef } from 'react';
import { WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { translate } from '../../../base/i18n/functions';
import Dialog from '../../../base/ui/components/web/Dialog';
//import { to } from 'react-emoji-render/data/aliases';

/**
 * The type of {@link UserLocationDialog}'s React {@code Component} props.
 */
interface IProps extends WithTranslation {
    participant: Participant
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
    token: string;

}
interface WhereClause {
    Filters: Array<{
      ConjuctionClause: number;
      FieldID: string;
      RelationalOperator: number;
      ValueType: number;
      value: string;
      Sequence: number;
      GroupID: number;
    }>;
    FilterLogic: string;
  }
  
  interface Value {
    AppFieldID: string;
    Value: string;
  }
  
  interface Payload {
    QueryObjectID: string;
    QueryType: number;
    Joins: any[];
    WhereClause: WhereClause;
    Values: Value[];
  }
function UserLocationDialog({ participant }: IProps) {
    const { display_name, longitude, latitude, address,token } = participant;
    const takeScreenshot = async () => {

      // Request media
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      const options: any = { preferCurrentTab: true };
      navigator.mediaDevices.getDisplayMedia(options).then(stream => {
          // Grab frame from stream
          let track = stream.getVideoTracks()[0];
          let capture = new ImageCapture(track);
          capture.grabFrame().then(bitmap => {
              // Stop sharing
              track.stop();

              // Draw the bitmap to canvas
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
              canvas?.getContext('2d')?.drawImage(bitmap, 0, 0);

              const imageUrl: string = canvas.toDataURL("image/png");

              // Create a download link and trigger the download
              const link: HTMLAnchorElement = document.createElement("a");
              link.href = imageUrl;
              link.download = new Date() + "screenshot.png";
              link.click();
          });
      })
          .catch(e => console.log(e));
  };
    // Construct the embed API URL
    const mapurl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`
    return (
        <Dialog
            ok={{ translationKey: 'Save' }}
            titleKey={display_name}
            onSubmit={() => {
                const meetingID = window.sessionStorage.getItem("meetingID")
                const myHeaders = new Headers();
                //"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzeXN0ZW0udXNlckB0ZWNoZXh0ZW5zb3IuY29tIiwianRpIjoiN2RkOGE0ZGMtZTNiNy00MzU4LWFhYWEtZjZlZTc3OTkzMTgyIiwiZW1haWwiOiJzeXN0ZW0udXNlckB0ZWNoZXh0ZW5zb3IuY29tIiwiaWQiOiJhOTZmYTc0ZS03MDE3LTQwYWUtOWRjNy05NmZhYzU2NzY2MDYiLCJsb2NhbGVTZXR0aW5nIjoie1wiVGltZVpvbmVJZFwiOm51bGwsXCJMb2NhbGVcIjowLFwiTGFuZ3VhZ2VcIjowLFwiRGF0ZUZvcm1hdFwiOm51bGwsXCJUaW1lRm9ybWF0XCI6bnVsbCxcIk51bWJlckZvcm1hdFwiOm51bGwsXCJDdXJyZW5jeVwiOm51bGx9Iiwicm9sZSI6IkFkbWluaXN0cmF0b3IiLCJSb2xlSWRzIjoiMkNCNDMxQTYtNTFFRS00NjNFLTg0MEMtM0ExOEM1RkU5MTUwIiwibmJmIjoxNzEyOTAzMzE2LCJleHAiOjE3NDQ0MzkzMTYsImlhdCI6MTcxMjkwMzMxNn0.QAHeBhx522ZyPsg7LXtPCW57m5fRr1c90JGb_2_zpgo"
                myHeaders.append("Authorization", token);
                myHeaders.append("content-type", "application/json");
                myHeaders.append("ApplicationCode", "Phoenix");
                const raw: Payload = {
                  QueryObjectID: "Meetings",
                  QueryType: 2,
                  Joins: [],
                  WhereClause: {
                    Filters: [
                      {
                        ConjuctionClause: 1,
                        FieldID: "ID",
                        RelationalOperator: 3,
                        ValueType: 1,
                        value: meetingID || "78d9fcd2-4220-423d-bf78-d64b15313149",
                        Sequence: 0,
                        GroupID: 0,
                      },
                    ],
                    FilterLogic: "1",
                  },
                  Values: [
                    {
                      AppFieldID: "InsuredLocation",
                      Value: address,
                    },
                  ],
                };
                
                const requestOptions: RequestInit = {
                  method: "POST",
                  headers: myHeaders,
                  body: JSON.stringify(raw),
                  redirect: "follow",
                };
                fetch("https://api.phoenixassurance.co.in/api/v1/CRUD/Update", requestOptions)
                  .then((response) => response.text())
                  .then((result) => console.log(result))
                  .catch((error) => console.error(error));
                
            }}
            size="large"
        >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>Address : {address}</p>
                <button onClick={() => takeScreenshot()}>Take Screenshot</button>
              </div>
                {/* Embed Google Map */}
                <iframe
                    title="Google Map"
                    src={mapurl}
                    style={{
                        width: '100%',
                        height: '400px',
                        border: 'none',
                        marginTop: '20px',
                    }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        </Dialog>
    );
}

// /**
//  * Implements the Logout dialog.
//  *
//  * @param {Object} props - The props of the component.
//  * @returns {React$Element}
//  */
// function UserLocationDialog({ onLogout, t,participant }: IProps) {
//     debugger
//     const { display_name, userType, longitude, latitude,address } = participant;

//     return (
//         <Dialog
//             ok = {{ translationKey: 'dialog.Yes' }}
//             // onSubmit = { onLogout }
//             // titleKey = { t('dialog.logoutTitle') }
//             size= {'large'}>
//             <div>
//                 hello {display_name} {longitude} {latitude} {address}
//                 {/* { t('dialog.logoutQuesti on') } */}
//             </div>
//         </Dialog>
//     );
// }

export default translate(connect()(UserLocationDialog));
