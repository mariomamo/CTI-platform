import {useParams} from "react-router-dom";
import useCtiFactoryService from "../../../services/Web3/CtiFactoryService.jsx";
import {useEffect, useState} from "react";
import StorageKeys from "../../../enums/StorageKeys.jsx";
import {useStorage} from "../../../contexts/storage/WebStorageProvider.jsx";
import CtiProposal from "../../../objects/cti/CtiProposal.jsx";
import useCtiService from "../../../services/Web3/CtiServiceHook.jsx";
import {CtiChoiceIndexes} from "../../../enums/CtiChoiceIndexes.jsx";
import {InvalidAddressError, ResourcesNotFoundError} from "web3";
import NotFoundError from "../../../exceptions/NotFoundError.jsx";
import {instanceOf} from "prop-types";

const WithLoadProposal = ({WrappedComponent}) => {
    const {address} = useParams();
    const storageService = useStorage();
    const ctiFactoryService = useCtiFactoryService();
    const ctiService = useCtiService();
    const [ctiProposal, setCtiProposal] = useState(new CtiProposal());
    const [isLoading, setIsLoading] = useState(true);
    const [unauthorizedError, setUnauthorizedError] = useState(false);
    const [notFoundError, setNotFoundError] = useState(false);
    const [fullAccess, setFullAccess] = useState(false);

    useEffect(() => {
        if (address) {
            ctiService.getCti(address)
                .then(daoServiceResult => {
                    let accessToken;
                    return storageService.get(StorageKeys.ACCESS_TOKEN.description)
                        .then(at => accessToken = at)
                        .then(() => {
                            return ctiFactoryService.getCtiInfoByHash(daoServiceResult.hash, accessToken)
                                .then(response => {
                                    const result = response.data[0];
                                    if (result.optionalParameters) {
                                        setFullAccess(true);
                                    }
                                    daoServiceResult.title = result.mandatoryParameters.name;
                                    daoServiceResult.description = result.mandatoryParameters.description;
                                    daoServiceResult.optionalParameters = result.optionalParameters;
                                    updateCtiInfo(daoServiceResult);
                                })
                                .catch(response => {
                                    if (response.response.status === 401) {
                                        setUnauthorizedError(true);
                                        setNotFoundError(false);
                                    } else {
                                        setNotFoundError(true);
                                        setUnauthorizedError(false);
                                    }
                                });
                        })
                })
                .catch(error => {
                    if (error instanceof InvalidAddressError || error instanceof NotFoundError) {
                        setNotFoundError(true);
                        setUnauthorizedError(false);
                    }
                })
                .finally(() => setIsLoading(false));
        }
    }, [address]);

    const updateCtiInfo = (result) => {
        const newCtiInfo = new CtiProposal();
        newCtiInfo.id = result.id;
        newCtiInfo.address = address;
        newCtiInfo.hash = result.hash;
        newCtiInfo.startingVote = result.startingVote;
        newCtiInfo.endingVote = result.endingVote;
        newCtiInfo.status = result.status;
        newCtiInfo.description = result.description;
        newCtiInfo.title = result.title;
        newCtiInfo.accepted = Number(result.voteAmounts[CtiChoiceIndexes.VALID.description]);
        newCtiInfo.rejected = Number(result.voteAmounts[CtiChoiceIndexes.INVALID.description]);
        newCtiInfo.abstained = Number(result.voteAmounts[CtiChoiceIndexes.ABSTAIN.description]);
        newCtiInfo.optionalParameters = result.optionalParameters;
        setCtiProposal(newCtiInfo);
    }

    return (
        <WrappedComponent ctiProposal={ctiProposal} isLoading={isLoading} unauthorizedError={unauthorizedError}
                          notFoundError={notFoundError} fullAccess={fullAccess}/>
    )
}

export default WithLoadProposal;