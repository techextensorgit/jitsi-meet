import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { createToolbarEvent } from '../../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../../analytics/functions';
import { leaveConference } from '../../../base/conference/actions';
import { BUTTON_TYPES } from '../../../base/ui/constants.web';

import { HangupContextMenuItem } from './HangupContextMenuItem';

/**
 * The type of the React {@code Component} props of {@link LeaveConferenceButton}.
 */
interface IProps {

    /**
     * Key to use for toolbarButtonClicked event.
     */
    buttonKey: string;

    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;
}


/**
 * Button to leave the conference.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - The leave conference button.
 */
export const LeaveConferenceButton = (props: IProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    var raw = JSON.stringify({
        "type": "ParticipantLeave",
        "meetingID": window.sessionStorage.getItem("meetingID"),
        "data": {
            "from": window.sessionStorage.getItem("name"),
            "time": new Date()
        }
    });
    const onLeaveConference = useCallback(() => {


        console.log("onLeaveConference", raw)

        window.top?.postMessage({ type: "endMeeting", value: raw }, '*');

        sendAnalytics(createToolbarEvent('hangup'));

        dispatch(leaveConference());
<<<<<<< HEAD
        window.top?.postMessage({ type: "endMeeting", value: true }, '*');
=======
>>>>>>> 6e70776e351972c138c07b46ba6da96762462e43

    }, [ dispatch ]);

    return (
        <HangupContextMenuItem
            accessibilityLabel = { t('toolbar.accessibilityLabel.leaveConference') }
            buttonKey = { props.buttonKey }
            buttonType = { BUTTON_TYPES.SECONDARY }
            label = { t('toolbar.leaveConference') }
            notifyMode = { props.notifyMode }
            onClick = { onLeaveConference } />
    );
};
