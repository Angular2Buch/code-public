export declare class TemplateCloner {
    maxInMemoryElementsPerTemplate: number;
    constructor(maxInMemoryElementsPerTemplate: any);
    prepareForClone(templateRoot: Element): Element | string;
    cloneContent(preparedTemplateRoot: Element | string, importNode: boolean): Node;
}
