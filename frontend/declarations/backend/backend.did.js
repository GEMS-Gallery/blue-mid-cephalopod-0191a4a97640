export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'calculate_cycles' : IDL.Func([IDL.Float64, IDL.Bool], [Result], ['query']),
    'get_icp_price' : IDL.Func([], [IDL.Float64], ['query']),
    'purchase_cycles' : IDL.Func([IDL.Float64, IDL.Bool], [Result], []),
    'update_icp_price' : IDL.Func([IDL.Float64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
