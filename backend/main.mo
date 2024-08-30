import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Array "mo:base/Array";

actor {
  stable var icp_price : Float = 7.50;
  stable var total_cycles_sold : Nat = 0;
  stable var usage_data : [Nat] = [];

  let CYCLES_PER_ICP : Nat = 10_000_000_000_000;

  func icp_to_cycles(icp_amount : Float) : Nat {
    let cycles = Float.toInt(icp_amount * Float.fromInt(CYCLES_PER_ICP));
    return Nat.fromInt(cycles);
  };

  public query func get_icp_price() : async Float {
    return icp_price;
  };

  public query func calculate_cycles(amount : Float, is_icp : Bool) : async Result.Result<Nat, Text> {
    if (amount <= 0) {
      return #err("Amount must be greater than zero");
    };

    let cycles = if (is_icp) {
      icp_to_cycles(amount)
    } else {
      icp_to_cycles(amount / icp_price)
    };

    return #ok(cycles);
  };

  public func purchase_cycles(amount : Float, is_icp : Bool) : async Result.Result<Nat, Text> {
    let cycles_result = await calculate_cycles(amount, is_icp);

    switch (cycles_result) {
      case (#ok(cycles)) {
        total_cycles_sold += cycles;
        #ok(cycles)
      };
      case (#err(message)) {
        #err(message)
      };
    };
  };

  public func update_icp_price(new_price : Float) : async () {
    icp_price := new_price;
    Debug.print("ICP price updated to: " # Float.toText(new_price));
  };

  public func record_usage(usage : Nat) : async () {
    usage_data := Array.append(usage_data, [usage]);
    if (usage_data.size() > 30) {
      usage_data := Array.tabulate(30, func (i : Nat) : Nat { usage_data[i + 1] });
    };
  };

  public query func get_average_usage() : async Float {
    if (usage_data.size() == 0) {
      return 0;
    };
    let sum = Array.foldLeft<Nat, Nat>(usage_data, 0, func (acc, val) { acc + val });
    return Float.fromInt(sum) / Float.fromInt(usage_data.size());
  };
}
