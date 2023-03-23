import { Domain, PermitMessage, Result } from "../types";
import { LooksrareMakerOrderWithEncodedParams } from "../types/looksrare";
import { SeaPortPayload } from "../types/seaport";
import erc20Permit from "./erc20-permit";
import looksrare from "./looksrare";
import seaport from "./seaport";

export enum PROTOCOL_ID {
  OPENSEA_SEAPORT = "OPENSEA_SEAPORT",
  LOOKSRARE_EXCHANGE = "LOOKSRARE_EXCHANGE",
  BLUR_IO_MARKETPLACE = "BLUR_IO_MARKETPLACE",
  ERC20_PERMIT = "ERC20_PERMIT",
}

export const getProtocolId = (domain: Domain): PROTOCOL_ID | undefined => {
  if (seaport.isCorrectDomain(domain)) return PROTOCOL_ID.OPENSEA_SEAPORT;
  if (looksrare.isCorrectDomain(domain)) return PROTOCOL_ID.LOOKSRARE_EXCHANGE;
  return;
};

/**
 * @param {T} message EIP-712 message
 * @param {Domain} domain EIP-712 domain
 * @returns {Result} assets impact and message liveness
 * @throws {Error}
 */
export default async function visualize<T extends object>(
  message: T,
  domain: Domain
): Promise<Result> {
  const protocolId = getProtocolId(domain);

  switch (protocolId) {
    case PROTOCOL_ID.OPENSEA_SEAPORT:
      return seaport.visualize(message as SeaPortPayload, domain);

    case PROTOCOL_ID.LOOKSRARE_EXCHANGE:
      return looksrare.visualize(message as LooksrareMakerOrderWithEncodedParams, domain);

    default:
      if (erc20Permit.isERC20Permit(message)) {
        return erc20Permit.visualize(message as PermitMessage, domain);
      }

      throw new Error("Unrecognized/Unsupported Protocol Domain");
  }
}
