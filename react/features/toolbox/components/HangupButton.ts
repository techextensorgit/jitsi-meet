import _ from 'lodash';
import { connect } from 'react-redux';

import { createToolbarEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { leaveConference } from '../../base/conference/actions';
import { translate } from '../../base/i18n/functions';
import { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import AbstractHangupButton from '../../base/toolbox/components/AbstractHangupButton';

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @augments AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<AbstractButtonProps> {
    _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: AbstractButtonProps) {
        super(props);

        this._hangup = _.once(() => {
            sendAnalytics(createToolbarEvent('hangup'));
            console.log("hangup")
            this.props.dispatch(leaveConference());
        });
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {


        this._hangup();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "type": "ParticipantLeave",
            "meetingID": window.sessionStorage.getItem("meetingID"),
            "data": {
                "from": window.sessionStorage.getItem("name"),
                "time": new Date()
            }
        });

        const requestOptions : RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://elsa.techextensor.com/Jitsiwebhook/InsertMeetingEvent", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error" + error));

    }
}

export default translate(connect()(HangupButton));
