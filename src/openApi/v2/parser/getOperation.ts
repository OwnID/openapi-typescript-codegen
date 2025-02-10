import type { Operation } from '../../../client/interfaces/Operation';
import type { OperationParameters } from '../../../client/interfaces/OperationParameters';
import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiOperation } from '../interfaces/OpenApiOperation';
import { getOperationErrors } from './getOperationErrors';
import { getOperationName } from './getOperationName';
import { getOperationParameters } from './getOperationParameters';
import { getOperationResponseHeader } from './getOperationResponseHeader';
import { getOperationResponses } from './getOperationResponses';
import { getOperationResults } from './getOperationResults';
import { getServiceName } from './getServiceName';
import { sortByRequired } from './sortByRequired';

export const getOperation = (
    openApi: OpenApi,
    url: string,
    method: string,
    tag: string,
    op: OpenApiOperation,
    pathParams: OperationParameters
): Operation => {
    const serviceName = getServiceName(tag);
    const operationName = getOperationName(url, method, op.operationId);

    // Create a new operation object for this method.
    const operation: Operation = {
        service: serviceName,
        name: operationName,
        summary: op.summary || null,
        description: op.description || null,
        deprecated: op.deprecated === true,
        method: method.toUpperCase(),
        path: url,
        parameters: [...pathParams.parameters],
        parametersPath: [...pathParams.parametersPath],
        parametersPathRequired: pathParams.parametersPath.some(p => p.isRequired),
        parametersQuery: [...pathParams.parametersQuery],
        parametersQueryRequired: pathParams.parametersQuery.some(p => p.isRequired),
        parametersForm: [...pathParams.parametersForm],
        parametersFormRequired: pathParams.parametersForm.some(p => p.isRequired),
        parametersHeader: [...pathParams.parametersHeader],
        parametersHeaderRequired: pathParams.parametersHeader.some(p => p.isRequired),
        parametersCookie: [...pathParams.parametersCookie],
        parametersCookieRequired: pathParams.parametersCookie.some(p => p.isRequired),
        parametersBody: pathParams.parametersBody,
        imports: [],
        errors: [],
        results: [],
        responseHeader: null,
    };

    // Parse the operation parameters (path, query, body, etc).
    if (op.parameters) {
        const parameters = getOperationParameters(openApi, op.parameters);
        operation.imports.push(...parameters.imports);
        operation.parameters.push(...parameters.parameters);
        operation.parametersPath.push(...parameters.parametersPath);
        operation.parametersPathRequired = parameters.parametersPath.some(p => p.isRequired);
        operation.parametersQuery.push(...parameters.parametersQuery);
        operation.parametersQueryRequired = parameters.parametersQuery.some(p => p.isRequired);
        operation.parametersForm.push(...parameters.parametersForm);
        operation.parametersFormRequired = parameters.parametersForm.some(p => p.isRequired);
        operation.parametersHeader.push(...parameters.parametersHeader);
        operation.parametersHeaderRequired = parameters.parametersHeader.some(p => p.isRequired);
        operation.parametersCookie.push(...parameters.parametersCookie);
        operation.parametersCookieRequired = parameters.parametersCookie.some(p => p.isRequired);
        operation.parametersBody = parameters.parametersBody;
    }

    // Parse the operation responses.
    if (op.responses) {
        const operationResponses = getOperationResponses(openApi, op.responses);
        const operationResults = getOperationResults(operationResponses);
        operation.errors = getOperationErrors(operationResponses);
        operation.responseHeader = getOperationResponseHeader(operationResults);

        operationResults.forEach(operationResult => {
            operation.results.push(operationResult);
            operation.imports.push(...operationResult.imports);
        });
    }

    operation.parameters = operation.parameters.sort(sortByRequired);

    return operation;
};
