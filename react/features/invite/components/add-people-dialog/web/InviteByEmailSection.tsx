import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { isIosMobileBrowser } from '../../../../base/environment/utils';
import Icon from '../../../../base/icons/components/Icon';
import {
    IconCopy,
    IconEnvelope,
    IconGoogle,
    IconOffice365,
    IconYahoo
} from '../../../../base/icons/svg';
import Tooltip from '../../../../base/tooltip/components/Tooltip';
import { copyText } from '../../../../base/util/copyText.web';
import { showSuccessNotification } from '../../../../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE } from '../../../../notifications/constants';
interface IProps {

    /**
     * The encoded invitation subject.
     */
    inviteSubject: string;

    /**
     * The encoded invitation text to be sent.
     */
    inviteText: string;

    /**
     * The encoded no new-lines iOS invitation text to be sent on default mail.
     */
    inviteTextiOS: string;
}

const useStyles = makeStyles()(theme => {
    return {
        container: {
            marginTop: theme.spacing(4)
        },

        label: {
            marginBottom: theme.spacing(2)
        },

        iconRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },

        iconContainer: {
            display: 'block',
            padding: theme.spacing(2),
            cursor: 'pointer'
        }
    };
});

/**
 * Component that renders email invite options.
 *
 * @returns {ReactNode}
 */
function InviteByEmailSection({ inviteSubject, inviteText, inviteTextiOS }: IProps) {
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const { t } = useTranslation();
    const joinMeetingIndex = inviteText.indexOf("Join the meeting:");

    // Extract everything from the start up to and including "Join the meeting:"
    const extractedMessage = inviteText.substring(0, joinMeetingIndex + "Join the meeting:".length);

    // Output the extracted message
    console.log(extractedMessage);

    const createCurrentUrl = "\nhttps://claims.phoenixassurance.co.in/meeting?meetingId=" +
        window.sessionStorage.getItem("meetingID") + "&url=" + window.location.href + '#userInfo.displayName=""&userInfo.email=""&MeetingID=' + window.sessionStorage.getItem("meetingID") + "&IsModerator=false"

    const encodedInviteSubject = encodeURIComponent(inviteSubject);
    const encodedInviteText = encodeURIComponent(extractedMessage + createCurrentUrl);
    const encodedInviteTextiOS = encodeURIComponent(inviteTextiOS);

    const encodedDefaultEmailText = isIosMobileBrowser() ? encodedInviteTextiOS : encodedInviteText;

    /**
     * Copies the conference invitation to the clipboard.
     *
     * @returns {void}
     */
    function _onCopyText() {

        alert(extractedMessage + createCurrentUrl)
        dispatch(showSuccessNotification({
            titleKey: 'dialog.copied'
        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
        copyText(extractedMessage + createCurrentUrl);
    }

    /**
     * Copies the conference invitation to the clipboard.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    function _onCopyTextKeyPress(e: React.KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            dispatch(showSuccessNotification({
                titleKey: 'dialog.copied'
            }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
            copyText(extractedMessage + createCurrentUrl);
        }
    }

    /**
     * Renders clickable elements that each open an email client
     * containing a conference invite.
     *
     * @returns {ReactNode}
     */
    function renderEmailIcons() {
        const PROVIDER_MAPPING = [
            {
                icon: IconEnvelope,
                tooltipKey: 'addPeople.defaultEmail',
                url: `mailto:?subject=${encodedInviteSubject}&body=${encodedDefaultEmailText}`
            },
            {
                icon: IconGoogle,
                tooltipKey: 'addPeople.googleEmail',
                url: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedInviteSubject}&body=${encodedInviteText}`
            },
            {
                icon: IconOffice365,
                tooltipKey: 'addPeople.outlookEmail',
                // eslint-disable-next-line max-len
                url: `https://outlook.office.com/mail/deeplink/compose?subject=${encodedInviteSubject}&body=${encodedInviteText}`
            },
            {
                icon: IconYahoo,
                tooltipKey: 'addPeople.yahooEmail',
                url: `https://compose.mail.yahoo.com/?To=&Subj=${encodedInviteSubject}&Body=${encodedInviteText}`
            }
        ];

        return (
            <>
                {
                    PROVIDER_MAPPING.map(({ icon, tooltipKey, url }, idx) => (
                        <Tooltip
                            content={t(tooltipKey)}
                            key={idx}
                            position='top'>
                            <a
                                aria-label={t(tooltipKey)}
                                className={classes.iconContainer}
                                href={url}
                                rel='noopener noreferrer'
                                target='_blank'>
                                <Icon src={icon} />
                            </a>
                        </Tooltip>
                    ))
                }
            </>
        );

    }

    return (
        <>
            <div className={classes.container}>
                <p className={classes.label}>{t('addPeople.shareInvite')}</p>
                <div className={classes.iconRow}>
                    <Tooltip
                        content={t('addPeople.copyInvite')}
                        position='top'>
                        <div
                            aria-label={t('addPeople.copyInvite')}
                            className={classes.iconContainer}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={_onCopyText}
                            // eslint-disable-next-line react/jsx-no-bind
                            onKeyPress={_onCopyTextKeyPress}
                            role='button'
                            tabIndex={0}>
                            <Icon src={IconCopy} />
                        </div>
                    </Tooltip>
                    {renderEmailIcons()}
                </div>
            </div>
        </>
    );
}

export default InviteByEmailSection;
