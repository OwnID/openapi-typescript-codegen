import type { Model } from '../../../client/interfaces/Model';
import type { OperationResponse } from '../../../client/interfaces/OperationResponse';

const areEqual = (a: Model, b: Model): boolean => {
    const equal = a.type === b.type && a.base === b.base && a.template === b.template;
    if (equal && a.link && b.link) {
        return areEqual(a.link, b.link);
    }
    return equal;
};

export const getOperationResults = (operationResponses: OperationResponse[]): OperationResponse[] => {

    const operationResults = [...operationResponses];

    if (!operationResults.length) {
        operationResults.push({
            in: 'response',
            name: '',
            code: 200,
            description: '',
            export: 'generic',
            type: 'void',
            base: 'void',
            template: null,
            link: null,
            isDefinition: false,
            isReadOnly: false,
            isRequired: false,
            isNullable: false,
            imports: [],
            enum: [],
            enums: [],
            properties: [],
        });
    }

    return operationResults.filter((operationResult, index, arr) => {
        return (
            arr.findIndex(item => {
                return item.code === operationResult.code && areEqual(item, operationResult);
            }) === index
        );
    });
};
