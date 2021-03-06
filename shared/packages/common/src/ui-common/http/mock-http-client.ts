import { HttpRequestMethod } from "./constants";
import { AbstractHttpClient, AbstractHttpResponse, HttpClient, HttpHeaders, HttpRequest, HttpRequestInit, HttpResponse } from "./http-client";

/**
 * Mock implementation of an HTTP client which throws an exception if an
 * unexpected request is made.
 */
export class MockHttpClient extends AbstractHttpClient implements HttpClient {

    private _expectedResponses: Record<string, HttpResponse[]> = {};

    async fetch(urlOrRequest: string | HttpRequest, requestProps?: HttpRequestInit): Promise<HttpResponse> {
        let key: string;
        let props = requestProps ?? {};
        if (typeof urlOrRequest === "string") {
            key = MockHttpClient._getKeyFromRequest(urlOrRequest, props);
        } else {
            key = MockHttpClient._getKeyFromRequest(urlOrRequest.url, props);
        }
        
        const expected = this._expectedResponses[key];
        if (expected && expected.length > 0) {
            const response = expected.shift();
            if (!response) {
                throw new MockHttpResponseError(`Expected response was null or undefined: ${key}`);
            }
            if (expected.length === 0) {
                delete this._expectedResponses[key];
            }
            return response;
        }

        throw new MockHttpResponseError(`Unexpected mock request: ${key}`);
    }

    addExpected(url: string, requestProps: HttpRequestInit, response: HttpResponse): void {
        const key = MockHttpClient._getKeyFromRequest(url, requestProps);
        const expected = this._expectedResponses[key] ?? [];
        expected.push(response);
        this._expectedResponses[key] = expected;
    }

    private static _getKeyFromRequest(url: string, requestProps: HttpRequestInit): string {
        const method = requestProps.method ?? HttpRequestMethod.Get;
        return `${method}::${url}`;
    }
}

export class MockHttpResponse extends AbstractHttpResponse{
    private _headers: HttpHeaders;
    private _status: number;
    private _url: string;
    private _body: string;

    get headers(): HttpHeaders {
        return this._headers;
    }

    get status(): number {
        return this._status;
    }

    get url(): string {
        return this._url;
    }

    constructor(url: string, status?: number, body?: string, headers?: HttpHeaders | Record<string, string>) {
        super();
        this._url = url;
        this._status = status ?? 200;
        this._body = body ?? "";
        this._headers = new MockHttpHeaders(headers);
    }

    async text(): Promise<string> {
        return this._body;
    }
}

export class MockHttpResponseError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class MockHttpHeaders implements HttpHeaders {
    private _map: Record<string, string[]> = {};

    constructor(headers?: HttpHeaders | Record<string, string>) {
        if (isHttpHeaders(headers)) {
            headers.forEach((value, key) => {
                this.append(key, value);
            });
        } else if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                this.append(key, value);
            }
        }
    }

    append(name: string, value: string): void {
        const values = this._map[name] ?? [];
        values.push(value);
        this._map[name] = values;
    }

    delete(name: string): void {
        delete this._map[name];
    }

    get(name: string): string | null {
        const values = this._map[name];
        if (values === null || values === undefined) {
            return null;
        }
        if (values.length > 1) {
            return values.join(", ");
        }
        return values[0];
    }

    has(name: string): boolean {
        return (this._map[name] !== null && this._map[name] !== undefined);
    }

    set(name: string, value: string): void {
        this._map[name] = [value];
    }

    forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
        for(const key of Object.keys(this._map)) {
            const value = this.get(key);
            if (value !== null && value !== undefined) {
                callback(value, key, this);
            }
        }
    }
}

function isHttpHeaders(obj: any): obj is HttpHeaders {
    return obj?.append && obj.has && obj.set;
}
