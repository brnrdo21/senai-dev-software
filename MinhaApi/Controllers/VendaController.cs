using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;

[ApiController]
[Route("api/[controller]")]
public class VendaController
    : ControllerBase
{
    private readonly IVendaService _service;

    public VendaController(
        IVendaService service)
        => _service = service;

// POST /api/venda
    [HttpPost]
    public IActionResult Create(
        [FromBody] Venda venda)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

    var criado = _service.Add(venda);

    return CreatedAtAction(
        nameof(GetById),
        new { id = criado.Id },
        criado);
}

    // GET /api/venda/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var venda = _service.GetById(id);
        if (venda == null)
            return NotFound();
        return Ok(venda);
    }
    // PUT /api/venda/1
    [HttpPut("{id}")]
    public IActionResult Update(
        int id,
        [FromBody] Venda venda)
{
    var atualizado =
        _service.Update(id, venda);

    if (atualizado == null)
        return NotFound();

    return Ok(atualizado);
}
}