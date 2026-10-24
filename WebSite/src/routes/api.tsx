import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { forwardApi } from '../services/api.server';
export const loader = ({ request }: LoaderFunctionArgs) => forwardApi(request);
export const action = ({ request }: ActionFunctionArgs) => forwardApi(request);
