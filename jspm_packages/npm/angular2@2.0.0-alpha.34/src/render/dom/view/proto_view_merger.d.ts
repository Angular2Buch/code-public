import { RenderProtoViewMergeMapping, RenderProtoViewRef } from '../../api';
import { TemplateCloner } from '../template_cloner';
export declare function mergeProtoViewsRecursively(templateCloner: TemplateCloner, protoViewRefs: List<RenderProtoViewRef | List<any>>): RenderProtoViewMergeMapping;
