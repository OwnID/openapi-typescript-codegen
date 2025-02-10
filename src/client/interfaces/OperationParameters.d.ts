import type { OperationParameter } from './OperationParameter';

export interface OperationParameters {
    imports: string[];
    parameters: OperationParameter[];
    parametersPath: OperationParameter[];
    parametersPathRequired: boolean;
    parametersQuery: OperationParameter[];
    parametersQueryRequired: boolean;
    parametersForm: OperationParameter[];
    parametersFormRequired: boolean;
    parametersCookie: OperationParameter[];
    parametersCookieRequired: boolean;
    parametersHeader: OperationParameter[];
    parametersHeaderRequired: boolean
    parametersBody: OperationParameter | null;
}
