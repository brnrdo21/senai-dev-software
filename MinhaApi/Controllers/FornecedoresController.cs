using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;

[ApiController]
[Route("api/[controller]")]
public class FornecedoresController : ControllerBase
{
    private readonly IFornecedoresService _service;

    public FornecedoresController(IFornecedoresService service)
        => _service = service;

    // GET /api/fornecedores
    [HttpGet]
    public IActionResult GetAll()
    {
        var fornecedores = _service.GetAll();
        return Ok(fornecedores);
    }

    // GET /api/fornecedores/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var fornecedor = _service.GetById(id);
        if (fornecedor == null)
            return NotFound();
        return Ok(fornecedor);
    }
    // GET /api/fornecedores/nome
    [HttpGet("nome/{nome}")]
    public IActionResult GetByNome(string nome)
    {
        var fornecedor = _service.GetByNome(nome);
        if (fornecedor == null)
            return NotFound();
        return Ok(fornecedor);
    }
    // GET /api/fornecedores/cnpj
    [HttpGet("cnpj/{cnpj}")]
    public IActionResult GetByCnpj(string cnpj)
    {
        var fornecedor = _service.GetByCnpj(cnpj);
        if (fornecedor == null)
            return NotFound();
        return Ok(fornecedor);
    }
    // POST /api/fornecedores
    [HttpPost]
    public IActionResult Create(
        [FromBody] Fornecedores fornecedor)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

    var criado = _service.Create(fornecedor);

    return CreatedAtAction(
        nameof(GetById),
        new { id = criado.Id },
        criado);
}
    // PUT /api/fornecedores/1
    [HttpPut("{id}")]
    public IActionResult Update(
        int id,
        [FromBody] Fornecedores fornecedor)
{
    var atualizado =
        _service.Update(id, fornecedor);

    if (atualizado == null)
        return NotFound();

    return Ok(atualizado);
}

    // DELETE /api/fornecedores/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
{
    var deletado = _service.Delete(id);

    if (!deletado)
        return NotFound();

    return NoContent();
}
}