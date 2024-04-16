import { AnyAction } from 'redux';

import { IStore } from '../app/types';
import { hideDialog, openDialog } from '../base/dialog/actions';
import { isDialogOpen } from '../base/dialog/functions';
import { getLocalParticipant } from '../base/participants/functions';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import { navigateRoot } from '../mobile/navigation/rootNavigationContainerRef';
import { screen } from '../mobile/navigation/routes';

import { SET_WHITEBOARD_OPEN } from './actionTypes';
import {
    notifyWhiteboardLimit,
    restrictWhiteboard
} from './actions';
import WhiteboardLimitDialog from './components/native/WhiteboardLimitDialog';
import {
    getCollabDetails,
    getCollabServerUrl,
    shouldEnforceUserLimit,
    shouldNotifyUserLimit
} from './functions';
import './middleware.any';

/**
 * Middleware which intercepts whiteboard actions to handle changes to the related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register((store: IStore) => (next: Function) => async (action: AnyAction) => {
    const { dispatch, getState } = store;
    const state = getState();

    switch (action.type) {
    case SET_WHITEBOARD_OPEN: {
        const enforceUserLimit = shouldEnforceUserLimit(state);
        const notifyUserLimit = shouldNotifyUserLimit(state);

        if (enforceUserLimit) {
            dispatch(restrictWhiteboard(false));
            dispatch(openDialog(WhiteboardLimitDialog));

            return next(action);
        }

        if (action.isOpen) {
            if (enforceUserLimit) {
                dispatch(restrictWhiteboard());

                return next(action);
            }

            if (notifyUserLimit) {
                dispatch(notifyWhiteboardLimit());
            }

            if (isDialogOpen(state, WhiteboardLimitDialog)) {
                dispatch(hideDialog(WhiteboardLimitDialog));
            }

            const collabDetails = getCollabDetails(state);
            const collabServerUrl = getCollabServerUrl(state);
            const localParticipantName = getLocalParticipant(state)?.name;

            navigateRoot(screen.conference.whiteboard, {
                collabDetails,
                collabServerUrl,
                localParticipantName
            });

            return next(action);
        }

        break;
    }
    }

    return next(action);
});
