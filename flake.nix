{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    let out = system:
      let
        overlay = final: prev: {
        };
        pkgs = import nixpkgs {
          inherit system;
          overlays = [overlay];
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [pkgs.yarn];
        };

      }; in with utils.lib; eachSystem defaultSystems out;

}
