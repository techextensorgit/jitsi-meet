import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';

import CopyButton from '../../../../base/buttons/CopyButton.web';
import { getDecodedURI } from '../../../../base/util/uri';


interface IProps {

    /**
     * The URL of the conference.
     */
    url: string;
}

const useStyles = makeStyles()(theme => {
    return {
        label: {
            display: 'block',
            marginBottom: theme.spacing(2)
        }
    };
});

/**
 * Component meant to enable users to copy the conference URL.
 *
 * @returns {React$Element<any>}
 */
function CopyMeetingLinkSection({ url }: IProps) {
    const { classes } = useStyles();
    const { t } = useTranslation();
    //https://release-qa-tabpanel.phoenixassurance.co.in/meeting?meetingId=cc9395d4-3dae-4205-8b0a-8150a0656a61&url=https://
    // jitsi.phoenixassurance.co.in/checkmeetingjoinandleavr_Claim6352_1714388214869#
    // userInfo.displayName="Claim%20Manager%20%20Nishi%20Passwala"&userInfo.email="nishi%40yopmail.com"&
    // MeetingID=cc9395d4-3dae-4205-8b0a-8150a0656a61&IsModerator=false&UserId=0881f89c-2f3b-4638-af68-4982adc1ef52
    const createCurrentUrl = "https://release-qa-tabpanel.phoenixassurance.co.in/meeting?meetingId=" +
        window.sessionStorage.getItem("meetingID") + "&url=" + url + '#userInfo.displayName=""&userInfo.email=""&MeetingID=' + window.sessionStorage.getItem("meetingID") + "&IsModerator=false"
    return (
        <>
            <p className={classes.label}>{t('addPeople.shareLink')}</p>
            <CopyButton
                accessibilityText={t('addPeople.accessibilityLabel.meetingLink', {
                    url: createCurrentUrl
                })}
                className='invite-more-dialog-conference-url'
                displayedText={createCurrentUrl}
                id='add-people-copy-link-button'
                textOnCopySuccess={t('addPeople.linkCopied')}
                textOnHover={t('addPeople.copyLink')}
                textToCopy={createCurrentUrl} />
        </>
    );
}

export default CopyMeetingLinkSection;
