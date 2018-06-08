import { Injectable } from "@angular/core";
import { AccessToken, ServerError } from "@batch-flask/core";
import { ElectronRemote, NotificationService } from "@batch-flask/ui";
import { BehaviorSubject, Observable } from "rxjs";

import { BatchLabsService } from "app/services/batch-labs.service";
import { AADService } from "client/core/aad";
import { AccessTokenCache } from "client/core/aad/access-token/access-token-cache";
import { Constants } from "common";

@Injectable()
export class AdalService {
    public tenantsIds: Observable<string[]>;

    private aadService: AADService;
    private tokenCache = new AccessTokenCache();
    private _waitingPromises: StringMap<Promise<AccessToken>> = {};
    private _tenantsIds = new BehaviorSubject<string[]>([]);

    constructor(
        private remote: ElectronRemote,
        batchLabs: BatchLabsService,
        private notificationService: NotificationService) {
        this.aadService = batchLabs.aadService;
        // Need to do this as aadService.tenantIds is in the node processs and electron lose information in the transfer
        this.aadService.tenantsIds.subscribe({
            next: (val) => {
                this._tenantsIds.next(val);
            },
            error: (error) => {
                const serverError = new ServerError(error);
                this._tenantsIds.error(serverError);
                this.notificationService.error(
                    `Error loading tenants. This could be an issue with proxy settings or your connection.`,
                    serverError.toString());
            },
        });
        this.tenantsIds = this._tenantsIds.asObservable();
    }

    public logout() {
        this.aadService.logout();
        this._waitingPromises = {};
    }

    public get currentUser() {
        return this.aadService.currentUser;
    }

    public accessTokenFor(tenantId: string, resource: string = null) {
        return Observable.fromPromise(this.accessTokenDataAsync(tenantId, resource).then(x => x.access_token));
    }

    /**
     *
     * @param tenantId
     * @param resource
     */
    public accessTokenData(tenantId: string, resource: string = null): Observable<AccessToken> {
        return Observable.fromPromise(this.accessTokenDataAsync(tenantId, resource));
    }

    /**
     *
     * @param tenantId
     * @param resource
     */
    public async accessTokenDataAsync(tenantId: string, resource: string = null): Promise<AccessToken> {
        const key = `${tenantId}/${resource}`;
        if (key in this._waitingPromises) {
            return this._waitingPromises[key];
        }
        if (this.tokenCache.hasToken(tenantId, resource)) {
            const token = this.tokenCache.getToken(tenantId, resource);
            if (!token.expireInLess(Constants.AAD.refreshMargin)) {
                return token;
            }
        }

        const promise = this.remote.send(Constants.IpcEvent.AAD.accessTokenData, { tenantId, resource }).then((x) => {
            const token = new AccessToken({ ...x });
            this.tokenCache.storeToken(tenantId, resource, token);
            delete this._waitingPromises[key];
            return token;
        });
        this._waitingPromises[key] = promise;
        return promise;
    }
}
