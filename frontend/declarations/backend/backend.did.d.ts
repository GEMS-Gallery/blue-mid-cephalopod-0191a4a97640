import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'calculate_cycles' : ActorMethod<[number, boolean], Result>,
  'get_icp_price' : ActorMethod<[], number>,
  'purchase_cycles' : ActorMethod<[number, boolean], Result>,
  'update_icp_price' : ActorMethod<[number], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
